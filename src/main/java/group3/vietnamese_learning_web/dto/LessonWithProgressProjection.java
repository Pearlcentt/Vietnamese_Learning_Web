package group3.vietnamese_learning_web.projection;

import group3.vietnamese_learning_web.model.LessonType;

public interface LessonWithProgressProjection {
    Integer getTopicId();
    Integer getLessonId();
    LessonType getLessonType();
    String getStatus();
    Integer getScore();
}
