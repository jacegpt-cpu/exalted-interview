import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Theme } from '../constants/theme';
import { playSelect } from '../utils/sound';

interface DatePickerFieldProps {
  day: string;
  month: string;
  year: string;
  onChangeDay: (d: string) => void;
  onChangeMonth: (m: string) => void;
  onChangeYear: (y: string) => void;
}

const MONTHS = [
  { name: 'January', val: '01' },
  { name: 'February', val: '02' },
  { name: 'March', val: '03' },
  { name: 'April', val: '04' },
  { name: 'May', val: '05' },
  { name: 'June', val: '06' },
  { name: 'July', val: '07' },
  { name: 'August', val: '08' },
  { name: 'September', val: '09' },
  { name: 'October', val: '10' },
  { name: 'November', val: '11' },
  { name: 'December', val: '12' },
];

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  day,
  month,
  year,
  onChangeDay,
  onChangeMonth,
  onChangeYear,
}) => {
  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const list: string[] = [];
    for (let y = currentYear - 10; y >= currentYear - 65; y--) {
      list.push(String(y));
    }
    return list;
  }, [currentYear]);

  // Calculate days in selected month & year
  const daysInMonth = useMemo(() => {
    if (!month) return 31;
    const y = parseInt(year || String(currentYear - 20), 10);
    const m = parseInt(month, 10);
    return new Date(y, m, 0).getDate();
  }, [month, year, currentYear]);

  const days = useMemo(() => {
    const list: string[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(d < 10 ? `0${d}` : String(d));
    }
    return list;
  }, [daysInMonth]);

  // Calculate age if all selected
  const age = useMemo(() => {
    if (!year || !month || !day) return null;
    const birth = new Date(`${year}-${month}-${day}`);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let calculatedAge = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculatedAge--;
    }
    return calculatedAge >= 0 ? calculatedAge : null;
  }, [year, month, day]);

  return (
    <View style={styles.container}>
      {/* Age / Preview Banner */}
      {Boolean(year && month && day) ? (
        <View style={styles.previewBanner}>
          <Text style={styles.previewIcon}>🎂</Text>
          <Text style={styles.previewText}>
            {MONTHS.find((m) => m.val === month)?.name} {parseInt(day, 10)}, {year}
            {age !== null ? ` • ${age} years old` : ''}
          </Text>
        </View>
      ) : null}

      <View style={styles.selectorsRow}>
        {/* Month Selector */}
        <View style={[styles.column, { flex: 1.4 }]}>
          <Text style={styles.columnLabel}>Month</Text>
          <View style={styles.scrollWrapper}>
            <ScrollView
              style={styles.scrollList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {MONTHS.map((m) => {
                const selected = month === m.val;
                return (
                  <TouchableOpacity
                    key={m.val}
                    activeOpacity={0.7}
                    onPress={() => {
                      playSelect();
                      onChangeMonth(m.val);
                    }}
                    style={[
                      styles.optionItem,
                      selected && styles.optionItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Day Selector */}
        <View style={[styles.column, { flex: 1 }]}>
          <Text style={styles.columnLabel}>Day</Text>
          <View style={styles.scrollWrapper}>
            <ScrollView
              style={styles.scrollList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {days.map((d) => {
                const selected = day === d;
                return (
                  <TouchableOpacity
                    key={d}
                    activeOpacity={0.7}
                    onPress={() => {
                      playSelect();
                      onChangeDay(d);
                    }}
                    style={[
                      styles.optionItem,
                      selected && styles.optionItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Year Selector */}
        <View style={[styles.column, { flex: 1.1 }]}>
          <Text style={styles.columnLabel}>Year</Text>
          <View style={styles.scrollWrapper}>
            <ScrollView
              style={styles.scrollList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {years.map((y) => {
                const selected = year === y;
                return (
                  <TouchableOpacity
                    key={y}
                    activeOpacity={0.7}
                    onPress={() => {
                      playSelect();
                      onChangeYear(y);
                    }}
                    style={[
                      styles.optionItem,
                      selected && styles.optionItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {y}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  previewBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primaryLight,
    borderColor: Theme.colors.cardBorderHover,
    borderWidth: 1,
    borderRadius: Theme.radii.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  previewIcon: {
    fontSize: 18,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  column: {
    minWidth: 70,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollWrapper: {
    height: 170,
    borderWidth: 1.5,
    borderColor: Theme.colors.inputBorder,
    borderRadius: Theme.radii.md,
    backgroundColor: Theme.colors.inputBg,
    overflow: 'hidden',
  },
  scrollList: {
    padding: 4,
  },
  optionItem: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: Theme.radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  optionItemSelected: {
    backgroundColor: Theme.colors.primary,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
