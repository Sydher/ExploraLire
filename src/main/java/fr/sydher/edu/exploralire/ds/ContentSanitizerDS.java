package fr.sydher.edu.exploralire.ds;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Set;
import java.util.regex.Pattern;

@ApplicationScoped
public class ContentSanitizerDS {

    private static final Set<String> ALLOWED_BLOCK_TYPES = Set.of("title", "text", "image");

    private static final Pattern SCRIPT_TAG_PATTERN = Pattern.compile(
            "<script[^>]*>.*?</script>",
            Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    private static final Pattern EVENT_HANDLER_PATTERN = Pattern.compile(
            "\\s+on\\w+\\s*=\\s*\"[^\"]*\"|\\s+on\\w+\\s*=\\s*'[^']*'",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern JAVASCRIPT_URL_PATTERN = Pattern.compile(
            "javascript\\s*:",
            Pattern.CASE_INSENSITIVE
    );

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String sanitizeContent(String content) {
        if (content == null || content.isBlank()) {
            return content;
        }

        try {
            JsonNode rootNode = objectMapper.readTree(content);
            JsonNode sanitizedNode = sanitizeNode(rootNode);
            return objectMapper.writeValueAsString(sanitizedNode);
        } catch (JsonProcessingException e) {
            return sanitizeHtmlString(content);
        }
    }

    public Object sanitizeContentObject(Object content) {
        if (content == null) {
            return null;
        }

        if (content instanceof String stringContent) {
            return sanitizeHtmlString(stringContent);
        }

        try {
            JsonNode node = objectMapper.valueToTree(content);
            JsonNode sanitizedNode = sanitizeNode(node);
            return objectMapper.treeToValue(sanitizedNode, Object.class);
        } catch (JsonProcessingException e) {
            return content;
        }
    }

    private JsonNode sanitizeNode(JsonNode node) {
        if (node == null || node.isNull()) {
            return node;
        }

        if (node.isTextual()) {
            return new TextNode(sanitizeHtmlString(node.asText()));
        }

        if (node.isArray()) {
            ArrayNode sanitizedArray = objectMapper.createArrayNode();
            for (JsonNode element : node) {
                JsonNode sanitizedElement = sanitizeNode(element);
                if (sanitizedElement != null) {
                    sanitizedArray.add(sanitizedElement);
                }
            }
            return sanitizedArray;
        }

        if (node.isObject()) {
            ObjectNode objectNode = (ObjectNode) node;

            if (objectNode.has("type")) {
                String blockType = objectNode.get("type").asText();
                if (!ALLOWED_BLOCK_TYPES.contains(blockType)) {
                    return null;
                }
            }

            if (objectNode.has("url")) {
                String url = objectNode.get("url").asText();
                if (!isValidUrl(url)) {
                    objectNode.put("url", "");
                }
            }

            ObjectNode sanitizedObject = objectMapper.createObjectNode();
            objectNode.fields().forEachRemaining(entry -> {
                JsonNode sanitizedValue = sanitizeNode(entry.getValue());
                if (sanitizedValue != null) {
                    sanitizedObject.set(entry.getKey(), sanitizedValue);
                }
            });
            return sanitizedObject;
        }

        return node;
    }

    public String sanitizeHtmlString(String html) {
        if (html == null || html.isBlank()) {
            return html;
        }

        String sanitized = html;
        sanitized = SCRIPT_TAG_PATTERN.matcher(sanitized).replaceAll("");
        sanitized = EVENT_HANDLER_PATTERN.matcher(sanitized).replaceAll("");
        sanitized = JAVASCRIPT_URL_PATTERN.matcher(sanitized).replaceAll("");

        return sanitized;
    }

    public boolean isValidUrl(String url) {
        if (url == null || url.isBlank()) {
            return true;
        }

        String trimmedUrl = url.trim().toLowerCase();

        if (JAVASCRIPT_URL_PATTERN.matcher(trimmedUrl).find()) {
            return false;
        }

        return trimmedUrl.startsWith("http://") ||
                trimmedUrl.startsWith("https://") ||
                trimmedUrl.startsWith("/") ||
                trimmedUrl.startsWith("./") ||
                trimmedUrl.startsWith("data:image/");
    }

    public boolean isAllowedBlockType(String type) {
        return ALLOWED_BLOCK_TYPES.contains(type);
    }

}
