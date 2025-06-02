package group3.vietnamese_learning_web.constants;

public class ProgressStatus {
    public static final String Not_Started = "Not_Started";
    public static final String In_Progress = "In_Progress";
    public static final String Completed = "Completed";

    // Private constructor to prevent instantiation
    private ProgressStatus() {
        throw new UnsupportedOperationException("This is a constants class and cannot be instantiated");
    }

    // Validation method
    public static boolean isValid(String status) {
        return Not_Started.equals(status) ||
                In_Progress.equals(status) ||
                Completed.equals(status);
    }

    // Get all valid statuses
    public static String[] getAllStatuses() {
        return new String[] { Not_Started, In_Progress, Completed };
    }
}
