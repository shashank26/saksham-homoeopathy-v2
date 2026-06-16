import { VitalityDrawerHeader } from "@/components/common/VitalityDrawerHeader";
import { FC } from "react";

type CreatePostHeaderProps = {
  onClose: () => void;
  title?: string;
};

export const CreatePostHeader: FC<CreatePostHeaderProps> = ({
  onClose,
  title = "Create Post",
}) => <VitalityDrawerHeader title={title} onClose={onClose} />;
