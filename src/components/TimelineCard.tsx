import React from 'react';
import { motion } from 'framer-motion';

export interface TimelineEvent {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: Date;
  actor?: 'System' | 'Applicant' | 'RM' | 'Bank';
  icon?: React.ReactNode;
  isCurrent?: boolean;
  isCompleted?: boolean;
}

interface TimelineCardProps {
  events: TimelineEvent[];
  className?: string;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ events, className = '' }) => {
  const getActorColor = (actor?: string) => {
    switch (actor) {
      case 'Applicant':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RM':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Bank':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'System':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActorIcon = (actor?: string) => {
    switch (actor) {
      case 'Applicant':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'RM':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      case 'Bank':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'System':
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Application Timeline</h3>
      </div>

      <div className="p-6">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-10"
              >
                {/* Status Dot */}
                <div className="absolute left-0 top-1">
                  {event.isCurrent ? (
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center">
                        <motion.div
                          className="w-3 h-3 rounded-full bg-blue-600"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.7, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 w-8 h-8 rounded-full bg-blue-400 animate-ping opacity-75" />
                    </div>
                  ) : event.isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 border-4 border-white shadow-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className={`bg-gray-50 rounded-lg p-4 border ${
                  event.isCurrent ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${
                        event.isCurrent ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    </div>

                    {event.actor && (
                      <div
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getActorColor(
                          event.actor
                        )}`}
                      >
                        {getActorIcon(event.actor)}
                        <span>{event.actor}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <time dateTime={event.timestamp.toISOString()}>
                      {event.timestamp.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
