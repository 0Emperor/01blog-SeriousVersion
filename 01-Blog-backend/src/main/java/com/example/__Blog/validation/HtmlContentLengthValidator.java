package com.example.__Blog.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class HtmlContentLengthValidator implements ConstraintValidator<HtmlContentLength, String> {

    private int min;
    private int max;

    @Override
    public void initialize(HtmlContentLength constraintAnnotation) {
        this.min = constraintAnnotation.min();
        this.max = constraintAnnotation.max();
    }

    @Override
    public boolean isValid(String htmlContent, ConstraintValidatorContext context) {
        if (htmlContent == null) {
            return true; // Use @NotNull for null checks
        }

        int calculatedLength = calculateContentLength(htmlContent);

        return calculatedLength >= min && calculatedLength <= max;
    }

    private int calculateContentLength(String html) {
        if (html == null || html.isEmpty()) {
            return 0;
        }

        // 1. Remove all HTML tags to get visible text
        // This simple regex removes anything between < and >, matching across lines if
        // needed (though . usually excludes newline)
        // We use (?s) for dotall if we want dot to match newlines, but <[^>]*> is
        // safer/standard for tags.
        String visibleText = html.replaceAll("<[^>]*>", "");

        // Trim whitespace to avoid counting excessive spacing?
        // User didn't specify, but usually we care about the characters.
        // Let's stick to just length of text without tags.
        // We might want to decode entities like &nbsp; to 1 char?
        // For simplicity and "plain HTML", simply stripping tags is the main request.
        // However, standard text usually interprets entities.
        // Without Jsoup/Apache Commons, unescaping is annoying.
        // Let's stick to raw stripped length for now as per plan assumption.

        int textLength = visibleText.length();

        // 2. Count media elements
        // We need to count <img, <video, <iframe occurrences in the ORIGINAL html.
        int mediaCount = countOccurrences(html, "<img")
                + countOccurrences(html, "<video")
                + countOccurrences(html, "<iframe");

        return textLength + mediaCount;
    }

    private int countOccurrences(String str, String target) {
        int count = 0;
        int idx = 0;
        while ((idx = str.indexOf(target, idx)) != -1) {
            count++;
            idx += target.length();
        }
        return count;
    }
}
