package group3.vietnamese_learning_web.model;

public enum ProgressStatus {
    Not_Started("Not Started"),
    In_Progress("In Progress"), 
    Completed("Completed");

    private final String dbValue;

    ProgressStatus(String dbValue) {
        this.dbValue = dbValue;
    }

    public String getDbValue() {
        return dbValue;
    }

    public static ProgressStatus fromDbValue(String dbValue) {
        for (ProgressStatus status : values()) {
            if (status.dbValue.equals(dbValue)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown ProgressStatus: " + dbValue);
    }
}
