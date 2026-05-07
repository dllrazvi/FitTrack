// @ts-nocheck
import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useStyles} from '../hooks/useStyles';
import {ExportService, ExportOptions} from '../services/ExportService';
import {DailyNutritionLog} from '../backend/models/Nutrition';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  nutritionData: DailyNutritionLog[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  visible,
  onClose,
  nutritionData,
}) => {
  const {theme} = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 7 days ago
      endDate: new Date().toISOString().split('T')[0], // today
    },
    includeMeals: true,
    includeTotals: true,
    includeCharts: false,
  });

  const styles = useStyles(theme => ({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    modalContent: {
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      margin: theme.spacing.md,
      maxHeight: '80%',
      width: '90%',
      maxWidth: 400,
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },

    title: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight,
      color: theme.colors.text,
    },

    closeButton: {
      padding: theme.spacing.sm,
    },

    closeButtonText: {
      fontSize: 24,
      color: theme.colors.textSecondary,
    },

    section: {
      marginBottom: theme.spacing.lg,
    },

    sectionTitle: {
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },

    optionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },

    optionLabel: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      flex: 1,
    },

    formatButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginHorizontal: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },

    formatButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },

    formatButtonText: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.text,
    },

    formatButtonTextActive: {
      color: theme.colors.buttonText,
    },

    switch: {
      transform: [{scaleX: 0.8}, {scaleY: 0.8}],
    },

    exportButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },

    exportButtonDisabled: {
      backgroundColor: theme.colors.textMuted,
    },

    exportButtonText: {
      color: theme.colors.buttonText,
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },

    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },

    loadingText: {
      marginLeft: theme.spacing.sm,
      color: theme.colors.textSecondary,
    },
  }));

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    try {
      await ExportService.exportNutritionData(nutritionData, exportOptions);
      Alert.alert('Success', 'Nutrition data exported successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    {key: 'csv', label: 'CSV', description: 'Spreadsheet format'},
    {key: 'json', label: 'JSON', description: 'Raw data format'},
    {key: 'pdf', label: 'HTML', description: 'Readable report'},
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Export Nutrition Data</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Format Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Export Format</Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {formatOptions.map(format => (
                  <TouchableOpacity
                    key={format.key}
                    style={[
                      styles.formatButton,
                      exportOptions.format === format.key &&
                        styles.formatButtonActive,
                    ]}
                    onPress={() =>
                      setExportOptions({
                        ...exportOptions,
                        format: format.key as any,
                      })
                    }>
                    <Text
                      style={[
                        styles.formatButtonText,
                        exportOptions.format === format.key &&
                          styles.formatButtonTextActive,
                      ]}>
                      {format.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Date Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>
                  From: {exportOptions.dateRange.startDate}
                </Text>
              </View>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>
                  To: {exportOptions.dateRange.endDate}
                </Text>
              </View>
            </View>

            {/* Export Options */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Include in Export</Text>

              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Individual meals</Text>
                <TouchableOpacity
                  onPress={() =>
                    setExportOptions({
                      ...exportOptions,
                      includeMeals: !exportOptions.includeMeals,
                    })
                  }>
                  <Text
                    style={{
                      color: exportOptions.includeMeals
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                    }}>
                    {exportOptions.includeMeals ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>Daily totals</Text>
                <TouchableOpacity
                  onPress={() =>
                    setExportOptions({
                      ...exportOptions,
                      includeTotals: !exportOptions.includeTotals,
                    })
                  }>
                  <Text
                    style={{
                      color: exportOptions.includeTotals
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                    }}>
                    {exportOptions.includeTotals ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Export Button */}
            <TouchableOpacity
              style={[
                styles.exportButton,
                isExporting && styles.exportButtonDisabled,
              ]}
              onPress={handleExport}
              disabled={isExporting}>
              {isExporting ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.buttonText}
                  />
                  <Text style={styles.loadingText}>Exporting...</Text>
                </View>
              ) : (
                <Text style={styles.exportButtonText}>Export Data</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

