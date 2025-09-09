export default function EmergencyHeader() {
  return (
    <div className="emergency-header text-white py-2 px-4 text-center text-sm font-medium">
      🚨 Emergency? Call{" "}
      <a href="tel:2044814243" className="font-bold underline" data-testid="link-emergency-phone">
        (204) 481-4243
      </a>{" "}
      • Email:{" "}
      <a href="mailto:info@9starrenovations.com" className="underline" data-testid="link-emergency-email">
        info@9starrenovations.com
      </a>
    </div>
  );
}
