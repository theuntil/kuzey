import PolicyLayout from "@/components/policies/PolicyLayout";
import policies from "@/data/policies.tr.json";

export const metadata = {
  title: "Politikalar | Kuzeybatı Haber",
  description: "Gizlilik politikası, kullanım şartları ve diğer yasal metinler"
};

export default function PoliciesPage() {
  return <PolicyLayout policies={policies} />;
}
