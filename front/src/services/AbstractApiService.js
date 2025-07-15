const ERR_GENERIC =
    "Erreur inconnue, merci de réessayer. Si le problème persiste, demande à ton professeur ; ce dernier pourra consulter la section d’aide du logiciel.";

export const handleResponse = async (res) => {
    const contentType = res.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = await res.text();
    }

    if (!res.ok) {
        // Extract Quarkus violations
        let messagesViolations;
        if (data.violations) {
            messagesViolations = data.violations
                .map((v) => v.message)
                .join("\n");
        }

        const error = new Error(
            data.message || messagesViolations || ERR_GENERIC
        );
        error.status = res.status;
        error.details = data;

        throw error;
    }

    return data;
};
