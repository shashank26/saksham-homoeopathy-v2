import { Auth } from "@/components/auth/Auth";
import { HelloText } from "@/components/Hello";
import "../global.css";

export default function Index() {
  return (
    <Auth>
      <HelloText />
    </Auth>
  );
}
