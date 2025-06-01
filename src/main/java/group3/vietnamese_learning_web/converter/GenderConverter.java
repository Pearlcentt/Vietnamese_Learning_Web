package group3.vietnamese_learning_web.converter;

import group3.vietnamese_learning_web.model.Gender;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class GenderConverter implements AttributeConverter<Gender, String> {

    @Override
    public String convertToDatabaseColumn(Gender gender) {
        if (gender == null) {
            return null;
        }

        // Convert new enum format to old database format
        switch (gender) {
            case MALE:
                return "Male";
            case FEMALE:
                return "Female";
            case OTHER:
                return "Other";
            default:
                throw new IllegalArgumentException("Unknown gender: " + gender);
        }
    }

    @Override
    public Gender convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }

        // Handle both old and new formats
        String normalizedData = dbData.trim();

        if ("Male".equalsIgnoreCase(normalizedData) || "MALE".equalsIgnoreCase(normalizedData)) {
            return Gender.MALE;
        } else if ("Female".equalsIgnoreCase(normalizedData) || "FEMALE".equalsIgnoreCase(normalizedData)) {
            return Gender.FEMALE;
        } else if ("Other".equalsIgnoreCase(normalizedData) || "OTHER".equalsIgnoreCase(normalizedData)) {
            return Gender.OTHER;
        } else {
            throw new IllegalArgumentException("Unknown gender value in database: " + dbData);
        }
    }
}
