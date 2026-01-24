package fr.sydher.edu.exploralire.ds;

import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ContentSanitizerDSTest {

    @Inject
    ContentSanitizerDS contentSanitizerDS;

    @Test
    void givenNullContent_whenSanitizeContent_thenReturnsNull() {
        // when
        String result = contentSanitizerDS.sanitizeContent(null);

        // then
        assertNull(result);
    }

    @Test
    void givenBlankContent_whenSanitizeContent_thenReturnsBlank() {
        // when
        String result = contentSanitizerDS.sanitizeContent("   ");

        // then
        assertEquals("   ", result);
    }

    @Test
    void givenContentWithScriptTag_whenSanitizeContent_thenRemovesScript() {
        // given
        String content = "<p>Hello</p><script>alert('xss')</script><p>World</p>";

        // when
        String result = contentSanitizerDS.sanitizeHtmlString(content);

        // then
        assertEquals("<p>Hello</p><p>World</p>", result);
    }

    @Test
    void givenContentWithUppercaseScriptTag_whenSanitizeContent_thenRemovesScript() {
        // given
        String content = "<p>Hello</p><SCRIPT>alert('xss')</SCRIPT><p>World</p>";

        // when
        String result = contentSanitizerDS.sanitizeHtmlString(content);

        // then
        assertEquals("<p>Hello</p><p>World</p>", result);
    }

    @Test
    void givenContentWithOnClickHandler_whenSanitizeContent_thenRemovesHandler() {
        // given
        String content = "<button onclick=\"alert('xss')\">Click</button>";

        // when
        String result = contentSanitizerDS.sanitizeHtmlString(content);

        // then
        assertEquals("<button>Click</button>", result);
    }

    @Test
    void givenContentWithOnErrorHandler_whenSanitizeContent_thenRemovesHandler() {
        // given
        String content = "<img src=\"x\" onerror=\"alert('xss')\">";

        // when
        String result = contentSanitizerDS.sanitizeHtmlString(content);

        // then
        assertEquals("<img src=\"x\">", result);
    }

    @Test
    void givenContentWithJavascriptUrl_whenSanitizeContent_thenRemovesJavascript() {
        // given
        String content = "<a href=\"javascript:alert('xss')\">Link</a>";

        // when
        String result = contentSanitizerDS.sanitizeHtmlString(content);

        // then
        assertFalse(result.contains("javascript:"));
    }

    @Test
    void givenCleanContent_whenSanitizeContent_thenReturnsUnchanged() {
        // given
        String content = "<p>Hello <strong>World</strong></p>";

        // when
        String result = contentSanitizerDS.sanitizeHtmlString(content);

        // then
        assertEquals("<p>Hello <strong>World</strong></p>", result);
    }

    @Test
    void givenHttpUrl_whenIsValidUrl_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isValidUrl("http://example.com/image.png");

        // then
        assertTrue(result);
    }

    @Test
    void givenHttpsUrl_whenIsValidUrl_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isValidUrl("https://example.com/image.png");

        // then
        assertTrue(result);
    }

    @Test
    void givenRelativeUrl_whenIsValidUrl_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isValidUrl("/images/photo.jpg");

        // then
        assertTrue(result);
    }

    @Test
    void givenDataImageUrl_whenIsValidUrl_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isValidUrl("data:image/png;base64,ABC123");

        // then
        assertTrue(result);
    }

    @Test
    void givenJavascriptUrl_whenIsValidUrl_thenReturnsFalse() {
        // when
        boolean result = contentSanitizerDS.isValidUrl("javascript:alert('xss')");

        // then
        assertFalse(result);
    }

    @Test
    void givenJavascriptUrlWithSpaces_whenIsValidUrl_thenReturnsFalse() {
        // when
        boolean result = contentSanitizerDS.isValidUrl("javascript : alert('xss')");

        // then
        assertFalse(result);
    }

    @Test
    void givenNullUrl_whenIsValidUrl_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isValidUrl(null);

        // then
        assertTrue(result);
    }

    @Test
    void givenBlankUrl_whenIsValidUrl_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isValidUrl("   ");

        // then
        assertTrue(result);
    }

    @Test
    void givenTitleBlockType_whenIsAllowedBlockType_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isAllowedBlockType("title");

        // then
        assertTrue(result);
    }

    @Test
    void givenTextBlockType_whenIsAllowedBlockType_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isAllowedBlockType("text");

        // then
        assertTrue(result);
    }

    @Test
    void givenImageBlockType_whenIsAllowedBlockType_thenReturnsTrue() {
        // when
        boolean result = contentSanitizerDS.isAllowedBlockType("image");

        // then
        assertTrue(result);
    }

    @Test
    void givenScriptBlockType_whenIsAllowedBlockType_thenReturnsFalse() {
        // when
        boolean result = contentSanitizerDS.isAllowedBlockType("script");

        // then
        assertFalse(result);
    }

    @Test
    void givenIframeBlockType_whenIsAllowedBlockType_thenReturnsFalse() {
        // when
        boolean result = contentSanitizerDS.isAllowedBlockType("iframe");

        // then
        assertFalse(result);
    }

    @Test
    void givenJsonContentWithScript_whenSanitizeContent_thenRemovesScript() {
        // given
        String content = "{\"text\":\"<script>alert('xss')</script>Hello\"}";

        // when
        String result = contentSanitizerDS.sanitizeContent(content);

        // then
        assertFalse(result.contains("<script>"));
        assertTrue(result.contains("Hello"));
    }

}
