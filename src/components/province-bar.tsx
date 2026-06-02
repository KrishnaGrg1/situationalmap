import { useGetProvinces } from '#/hooks/use-province';

export function ProvinceBar() {
  const { data: provinces, isLoading } = useGetProvinces();

  if (isLoading || !provinces) {
    return (
      <div className="bg-[#111520] border-t border-[#2A3248] px-4 py-3 flex gap-4 overflow-x-auto">
        <div className="text-[11px] text-[#5A6480] font-['IBM_Plex_Mono']">
          Loading provinces...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111520] border-t border-[#2A3248] px-4 py-3 flex gap-4 overflow-x-auto">
      <div className="text-[11px] text-[#5A6480] font-['IBM_Plex_Mono'] whitespace-nowrap mt-0.5">
        PROVINCES:
      </div>

      {provinces.map((province) => (
        <div
          key={province.name}
          className="cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border font-['IBM_Plex_Mono'] ${
              province.status === 'active'
                ? 'bg-[rgba(255,77,77,0.15)] text-[#FF4D4D] border-[rgba(255,77,77,0.2)]'
                : province.status === 'monitoring'
                  ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.2)]'
                  : 'bg-[rgba(16,185,129,0.15)] text-[#10B981] border-[rgba(16,185,129,0.2)]'
            }`}
          >
            {province.status === 'active'
              ? 'ACTIVE'
              : province.status === 'monitoring'
                ? 'WATCH'
                : 'CLEAR'}
          </span>

          <span className="text-xs text-[#E8EAF0]">{province.name}</span>

          <span
            className={`text-[11px] font-['IBM_Plex_Mono'] ${
              province.status === 'active'
                ? 'text-[#FF4D4D]'
                : province.status === 'monitoring'
                  ? 'text-[#F59E0B]'
                  : 'text-[#5A6480]'
            }`}
          >
            {province.count} inc
          </span>
        </div>
      ))}
    </div>
  );
}
