import { LoaderScreen } from "@/components/LoaderScreen";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { REPORT_REASON_OPTIONS } from "@/constants/moderation";
import {
  ModerationReport,
  ModerationService,
  UserBlock,
} from "@/services/Moderation.service";
import { MomentService } from "@/services/Moment.service";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { themeColors } from "@/themes/themes";
import { toast } from "burnt";
import { FC, useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const reasonLabel = (reason: string) =>
  REPORT_REASON_OPTIONS.find((o) => o.value === reason)?.label ?? reason;

const reportTitle = (type: ModerationReport["type"]) => {
  if (type === "message") return "Message report";
  if (type === "post") return "Post report";
  return "User report";
};

const ReportCard = ({ report }: { report: ModerationReport }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{reportTitle(report.type)}</Text>
    <Text style={styles.cardMeta}>Reason: {reasonLabel(report.reason)}</Text>
    <Text style={styles.cardMeta}>
      Reporter: {report.reporterPhone || report.reporterId}
    </Text>
    <Text style={styles.cardMeta}>
      Reported user: {report.reportedUserId}
    </Text>
    {report.postTitle ? (
      <Text style={styles.cardMeta}>Post: {report.postTitle}</Text>
    ) : null}
    {report.messageText ? (
      <Text style={styles.cardBody} numberOfLines={3}>
        &quot;{report.messageText}&quot;
      </Text>
    ) : null}
    {report.details ? (
      <Text style={styles.cardBody} numberOfLines={3}>
        Details: {report.details}
      </Text>
    ) : null}
    {report.createdAt ? (
      <Text style={styles.cardTime}>
        {MomentService.getDDMMMYYY(report.createdAt)}{" "}
        {MomentService.getTimeHHMM(report.createdAt)}
      </Text>
    ) : null}
  </View>
);

const BlockCard = ({ block }: { block: UserBlock }) => {
  const [unblocking, setUnblocking] = useState(false);

  const confirmUnblock = () => {
    Alert.alert(
      "Unblock user?",
      "This will remove the block so messaging can resume.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          onPress: async () => {
            setUnblocking(true);
            try {
              const success = await ModerationService.unblockUser(
                block.blockerId,
                block.blockedId,
              );
              if (success) {
                toast({ title: "User unblocked", preset: "done" });
              } else {
                toast({ title: "Could not unblock user", preset: "error" });
              }
            } finally {
              setUnblocking(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Blocked user</Text>
      <Text style={styles.cardMeta}>Blocker: {block.blockerId}</Text>
      <Text style={styles.cardMeta}>Blocked: {block.blockedId}</Text>
      <Text style={styles.cardMeta}>Chat: {block.chatId}</Text>
      {block.createdAt ? (
        <Text style={styles.cardTime}>
          {MomentService.getDDMMMYYY(block.createdAt)}{" "}
          {MomentService.getTimeHHMM(block.createdAt)}
        </Text>
      ) : null}
      <Pressable
        onPress={confirmUnblock}
        disabled={unblocking}
        style={styles.unblockButton}
      >
        <Text style={styles.unblockButtonText}>
          {unblocking ? "Unblocking..." : "Unblock"}
        </Text>
      </Pressable>
    </View>
  );
};

export const ModerationScreen: FC = () => {
  const fontsLoaded = useVitalityFonts();
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [blocks, setBlocks] = useState<UserBlock[]>([]);

  useEffect(() => {
    const unsubReports = ModerationService.onReportsUpdate(setReports);
    const unsubBlocks = ModerationService.onBlocksUpdate(setBlocks);
    return () => {
      unsubReports();
      unsubBlocks();
    };
  }, []);

  if (!fontsLoaded) {
    return <LoaderScreen />;
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.pageTitle}>Moderation</Text>
      <Text style={styles.subtitle}>
        Reports and blocks from patient-doctor chat and posts.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reports</Text>
        {reports.length === 0 ? (
          <Text style={styles.empty}>No reports yet.</Text>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Blocked users</Text>
        {blocks.length === 0 ? (
          <Text style={styles.empty}>No blocked users yet.</Text>
        ) : (
          blocks.map((block) => (
            <BlockCard key={block.id} block={block} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: themeColors.light,
  },
  content: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.stackLg,
    paddingBottom: loginSpacing.sectionGap,
  },
  pageTitle: {
    ...loginTypography.headlineLgMobile,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackSm,
  },
  subtitle: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackLg,
  },
  section: {
    marginBottom: loginSpacing.stackLg,
  },
  sectionTitle: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackMd,
  },
  empty: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginTop: loginSpacing.stackMd,
  },
  card: {
    backgroundColor: loginColors.surfaceContainerLowest,
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    padding: loginSpacing.stackMd,
    marginBottom: loginSpacing.stackSm,
    gap: 4,
  },
  cardTitle: {
    ...loginTypography.labelMd,
    fontFamily: "Manrope_600SemiBold",
    color: loginColors.onSurface,
  },
  cardMeta: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
  },
  cardBody: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
    marginTop: 4,
  },
  cardTime: {
    ...loginTypography.labelSm,
    color: loginColors.outlineVariant,
    marginTop: 4,
  },
  unblockButton: {
    marginTop: loginSpacing.stackSm,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    backgroundColor: loginColors.surface,
  },
  unblockButtonText: {
    ...loginTypography.labelMd,
    fontFamily: "Manrope_600SemiBold",
    color: loginColors.secondary,
  },
});
