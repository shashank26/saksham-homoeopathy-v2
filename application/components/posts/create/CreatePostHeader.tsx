import { VitalityDrawerHeader } from "@/components/common/VitalityDrawerHeader";
import { FC } from "react";

type CreatePostHeaderProps = {
  onClose: () => void;
};

export const CreatePostHeader: FC<CreatePostHeaderProps> = ({ onClose }) => (
  <VitalityDrawerHeader title="Create Post" onClose={onClose} />
);
