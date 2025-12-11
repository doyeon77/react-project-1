export default function MedicationCard({ item, onToggle }) {
  return (
    <div className="p-4 border rounded-xl shadow bg-white flex justify-between items-center mb-2">
      <div>
        <div className="font-bold text-lg">{item.name}</div>
        <div className="text-gray-500 text-sm">{item.time}</div>
      </div>

      <input
        type="checkbox"
        checked={item.taken}
        onChange={() => onToggle(item.id)}
        className="w-5 h-5"
      />
    </div>
  );
}
