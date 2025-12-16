import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../../context/ThemeContext';

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export default function GoalsScreen() {
  const navigation = useNavigation();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Cân nặng mục tiêu',
      current: 70,
      target: 65,
      unit: 'kg',
      icon: 'scale-outline',
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: 'Calories mỗi ngày',
      current: 1800,
      target: 2000,
      unit: 'kcal',
      icon: 'flame-outline',
      color: '#4ECDC4',
    },
    {
      id: '3',
      title: 'Bước chân',
      current: 6500,
      target: 10000,
      unit: 'bước',
      icon: 'footsteps-outline',
      color: '#95E1D3',
    },
    {
      id: '4',
      title: 'Nước uống',
      current: 1.5,
      target: 2.5,
      unit: 'lít',
      icon: 'water-outline',
      color: '#45B7D1',
    },
  ]);

  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowEditModal(true);
  };

  const handleSaveGoal = () => {
    if (editingGoal) {
      setGoals(goals.map(g => g.id === editingGoal.id ? editingGoal : g));
      setShowEditModal(false);
      setEditingGoal(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mục tiêu</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="trophy" size={24} color={colors.primary} />
            <Text style={styles.summaryTitle}>Tổng quan</Text>
          </View>
          <Text style={styles.summaryText}>
            Bạn đang hoàn thành {goals.filter(g => getProgress(g.current, g.target) >= 100).length}/{goals.length} mục tiêu
          </Text>
        </View>

        {/* Goals List */}
        {goals.map((goal) => {
          const progress = getProgress(goal.current, goal.target);
          return (
            <TouchableOpacity
              key={goal.id}
              style={styles.goalCard}
              onPress={() => handleEditGoal(goal)}
              activeOpacity={0.7}
            >
              <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
                <Ionicons name={goal.icon} size={28} color={goal.color} />
              </View>
              
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                
                <View style={styles.goalStats}>
                  <Text style={styles.goalCurrent}>
                    {goal.current} / {goal.target} {goal.unit}
                  </Text>
                  <Text style={[styles.goalProgress, { color: goal.color }]}>
                    {progress.toFixed(0)}%
                  </Text>
                </View>

                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { backgroundColor: goal.color + '30' }]}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress}%`, backgroundColor: goal.color }
                      ]}
                    />
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          );
        })}

        {/* Tips Card */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#FFA726" />
            <Text style={styles.tipsTitle}>Mẹo nhỏ</Text>
          </View>
          <Text style={styles.tipsText}>
            Đặt mục tiêu thực tế và theo dõi tiến trình hàng ngày. Thành công đến từ những bước nhỏ kiên trì!
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cập nhật mục tiêu</Text>
            
            {editingGoal && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Giá trị hiện tại</Text>
                  <TextInput
                    style={styles.input}
                    value={editingGoal.current.toString()}
                    onChangeText={(text) => setEditingGoal({
                      ...editingGoal,
                      current: parseFloat(text) || 0
                    })}
                    keyboardType="numeric"
                    placeholder="Nhập giá trị"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Mục tiêu</Text>
                  <TextInput
                    style={styles.input}
                    value={editingGoal.target.toString()}
                    onChangeText={(text) => setEditingGoal({
                      ...editingGoal,
                      target: parseFloat(text) || 0
                    })}
                    keyboardType="numeric"
                    placeholder="Nhập mục tiêu"
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowEditModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalButton, styles.saveButton]}
                    onPress={handleSaveGoal}
                  >
                    <Text style={styles.saveButtonText}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  summaryText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  goalIcon: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  goalCurrent: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginTop: spacing.xs,
  },
  progressBar: {
    height: 8,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  tipsCard: {
    backgroundColor: '#FFF3E0',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F57C00',
  },
  tipsText: {
    fontSize: 14,
    color: '#E65100',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
