package group3.vietnamese_learning_web.dto;

import group3.vietnamese_learning_web.model.ProgressStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProgressUpdateResult {
    private ProgressDTO progress;
    private boolean isNewProgress;
    private boolean scoreUpdated;
    private boolean statusUpdated;
    private Integer previousScore;
    private ProgressStatus previousStatus;
    
    public boolean hasAnyUpdate() {
        return isNewProgress || scoreUpdated || statusUpdated;
    }
    
    public String getUpdateSummary() {
        if (isNewProgress) {
            return "New progress created";
        }
        
        StringBuilder summary = new StringBuilder();
        if (scoreUpdated) {
            summary.append("Score updated from ").append(previousScore != null ? previousScore : 0)
                   .append(" to ").append(progress.getScore());
        }
        if (statusUpdated) {
            if (summary.length() > 0) summary.append(", ");
            summary.append("Status changed from ").append(previousStatus)
                   .append(" to ").append(progress.getStatus());
        }
        
        if (summary.length() == 0) {
            return "No changes made";
        }
        
        return summary.toString();
    }
}
