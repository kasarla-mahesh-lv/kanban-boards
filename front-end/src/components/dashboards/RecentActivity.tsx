import React from "react";

export type Activity = {
  id: number;
  message: string;
  time: string;
  icon: React.ReactNode;
};

interface Props {
  activities: Activity[];
}

const RecentActivity: React.FC<Props> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start gap-3">
            <div className="text-xl mt-1">{activity.icon}</div>
            <div>
              <p className="text-sm text-gray-700">{activity.message}</p>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivity;
