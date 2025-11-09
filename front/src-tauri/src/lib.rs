use std::process::{Command, Child, Stdio};
use std::io::{BufRead, BufReader};
use tauri::Manager;

static mut BACKEND_PROCESS: Option<Child> = None;

fn start_backend(app_handle: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let resource_path = app_handle.path().resource_dir()?;

    // Path to the backend
    let backend_path = resource_path.clone();

    // Path to bundled JRE
    let jre_path = resource_path.join("jre");
    let java_bin = if cfg!(target_os = "windows") {
        jre_path.join("bin/java.exe")
    } else {
        jre_path.join("bin/java")
    };

    // Use bundled JRE if available, otherwise system java
    let java_cmd = if java_bin.exists() {
        java_bin.to_str().unwrap().to_string()
    } else {
        "java".to_string()
    };

    // Start Quarkus backend with stdout/stderr capture
    let mut child = Command::new(java_cmd)
        .arg("-jar")
        .arg(backend_path.join("quarkus-run.jar"))
        .current_dir(&backend_path)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    // Capture stdout in a separate thread
    if let Some(stdout) = child.stdout.take() {
        std::thread::spawn(move || {
            let reader = BufReader::new(stdout);
            for line in reader.lines() {
                if let Ok(line) = line {
                    log::info!("[Backend] {}", line);
                }
            }
        });
    }

    // Capture stderr in a separate thread
    if let Some(stderr) = child.stderr.take() {
        std::thread::spawn(move || {
            let reader = BufReader::new(stderr);
            for line in reader.lines() {
                if let Ok(line) = line {
                    log::error!("[Backend] {}", line);
                }
            }
        });
    }

    unsafe {
        BACKEND_PROCESS = Some(child);
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(
      tauri_plugin_log::Builder::default()
        .level(log::LevelFilter::Info)
        .build(),
    )
    .setup(|app| {

      // Start backend server
      let app_handle = app.handle().clone();
      std::thread::spawn(move || {
          if let Err(e) = start_backend(&app_handle) {
              eprintln!("Failed to start backend: {}", e);
          }
      });

      Ok(())
    })
    .on_window_event(|_window, event| {
        if let tauri::WindowEvent::Destroyed = event {
            // Kill backend when app closes
            unsafe {
                if let Some(mut child) = BACKEND_PROCESS.take() {
                    let _ = child.kill();
                }
            }
        }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
