import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const ChatListSkeleton = () => {
  return (
    <div className="space-y-2 p-3">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 rounded-xl animate-pulse">
          <Skeleton circle width={50} height={50} />
          <div className="flex-1">
            <Skeleton width="60%" height={16} />
            <Skeleton width="80%" height={14} className="mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const MessageSkeleton = () => {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-end space-x-2 max-w-md">
            {i % 2 !== 0 && <Skeleton circle width={32} height={32} />}
            <div className="flex-1">
              <Skeleton 
                height={60} 
                borderRadius={16}
                className={i % 2 === 0 ? 'ml-auto' : ''}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="glass-light dark:glass-dark rounded-2xl p-6 animate-pulse">
      <div className="flex flex-col items-center">
        <Skeleton circle width={120} height={120} />
        <Skeleton width={200} height={24} className="mt-4" />
        <Skeleton width={150} height={16} className="mt-2" />
        <div className="w-full mt-6 space-y-4">
          <Skeleton height={40} borderRadius={12} />
          <Skeleton height={40} borderRadius={12} />
          <Skeleton height={40} borderRadius={12} />
        </div>
      </div>
    </div>
  );
};

export const SearchSkeleton = () => {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 rounded-xl animate-pulse">
          <Skeleton circle width={40} height={40} />
          <div className="flex-1">
            <Skeleton width="70%" height={16} />
            <Skeleton width="50%" height={14} className="mt-1" />
          </div>
          <Skeleton width={80} height={32} borderRadius={8} />
        </div>
      ))}
    </div>
  );
};

const LoadingSkeletons = {
  ChatListSkeleton,
  MessageSkeleton,
  ProfileSkeleton,
  SearchSkeleton,
};

export default LoadingSkeletons;
