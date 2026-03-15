import React from 'react';

interface EmptySetProps {
  debouncedSearchTerm: string;
}

const EmptySet: React.FC<EmptySetProps> = ({ debouncedSearchTerm }) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">"{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.</p>
    </div>
  );
};

export default EmptySet;
