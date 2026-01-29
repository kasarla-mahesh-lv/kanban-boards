interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold">{value}</h2>
      </div>
      <div className="text-3xl text-indigo-500">{icon}</div>
    </div>
  );
};

export default StatCard;
