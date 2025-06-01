package group3.vietnamese_learning_web.converter;

import group3.vietnamese_learning_web.model.ProgressStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ProgressStatusConverter implements AttributeConverter<ProgressStatus, String> {

    @Override
    public String convertToDatabaseColumn(ProgressStatus attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getDbValue();
    }

    @Override
    public ProgressStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return ProgressStatus.fromDbValue(dbData);
    }
}
