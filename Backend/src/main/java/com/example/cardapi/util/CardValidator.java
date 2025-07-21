package com.example.cardapi.util;

public class CardValidator {

    public static boolean isValidLuhn(String cardNo) {
        int sum = 0;
        boolean alternate = false;
        for (int i = cardNo.length() - 1; i >= 0; i--) {
            int n = cardNo.charAt(i) - '0';
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }

    public static boolean isValidExpiry(int month, int year) {
        java.time.YearMonth now = java.time.YearMonth.now();
        java.time.YearMonth exp = java.time.YearMonth.of(year, month);
        return !exp.isBefore(now);
    }
}
