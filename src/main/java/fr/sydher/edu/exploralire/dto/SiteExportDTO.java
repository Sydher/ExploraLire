package fr.sydher.edu.exploralire.dto;

import java.time.Instant;
import java.util.List;

public class SiteExportDTO {

    public String formatVersion;
    public Instant exportDate;
    public String application;
    public SiteData site;

    public SiteExportDTO() {
    }

    public SiteExportDTO(String formatVersion, Instant exportDate, String application, SiteData site) {
        this.formatVersion = formatVersion;
        this.exportDate = exportDate;
        this.application = application;
        this.site = site;
    }

    public static class SiteData {
        public String name;
        public String secretCode;
        public List<String> labels;
        public List<PageData> pages;

        public SiteData() {
        }

        public SiteData(String name, String secretCode, List<String> labels, List<PageData> pages) {
            this.name = name;
            this.secretCode = secretCode;
            this.labels = labels;
            this.pages = pages;
        }
    }

    public static class PageData {
        public String name;
        public Object content;

        public PageData() {
        }

        public PageData(String name, Object content) {
            this.name = name;
            this.content = content;
        }
    }

}
