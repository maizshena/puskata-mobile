// components/LoanCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Loan } from '@/types';
import { Colors } from '@/constants/Colors';
import { Button } from './ui/Button';

interface LoanCardProps {
  loan: Loan;
  onReturn?: (loanId: number) => void;
  showActions?: boolean;
}

export const LoanCard: React.FC<LoanCardProps> = ({
  loan,
  onReturn,
  showActions = true,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'returned':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'rejected':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: Colors.gray100, text: Colors.gray700 };
    }
  };

  const isOverdue = () => {
    if (loan.status === 'returned' || !loan.due_date) return false;
    return new Date(loan.due_date) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const statusColor = getStatusColor(loan.status);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{
            uri: loan.book?.cover_image || 'https://via.placeholder.com/100',
          }}
          style={styles.image}
        />
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={2}>
              {loan.book?.title}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
              <Text style={[styles.statusText, { color: statusColor.text }]}>
                {loan.status}
              </Text>
            </View>
          </View>

          <Text style={styles.author}>{loan.book?.author}</Text>

          <View style={styles.dates}>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color={Colors.gray600} />
              <Text style={styles.dateText}>
                Borrowed: {formatDate(loan.loan_date)}
              </Text>
            </View>
            <View style={styles.dateRow}>
              <Ionicons
                name="time-outline"
                size={14}
                color={isOverdue() ? Colors.error : Colors.gray600}
              />
              <Text style={[styles.dateText, isOverdue() && styles.overdueText]}>
                Due: {formatDate(loan.due_date)}
              </Text>
            </View>
            {loan.return_date && (
              <View style={styles.dateRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color={Colors.success} />
                <Text style={[styles.dateText, { color: Colors.success }]}>
                  Returned: {formatDate(loan.return_date)}
                </Text>
              </View>
            )}
          </View>

          {isOverdue() && (
            <View style={styles.overdueContainer}>
              <Ionicons name="alert-circle" size={12} color={Colors.error} />
              <Text style={styles.overdueLabel}>Overdue</Text>
            </View>
          )}
        </View>
      </View>

      {showActions && loan.status === 'approved' && onReturn && (
        <View style={styles.actions}>
          <Button
            title="Return Book"
            variant="outline"
            size="sm"
            onPress={() => onReturn(loan.id)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.gray100,
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 112,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  author: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 12,
  },
  dates: {
    gap: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.gray600,
    marginLeft: 6,
  },
  overdueText: {
    color: Colors.error,
    fontWeight: '600',
  },
  overdueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  overdueLabel: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '600',
    marginLeft: 4,
  },
  actions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.gray100,
  },
});