import FlexBox from "@/components/Layout/FlexBox";

const AnalysisTab = () => {
  return (
    <>
      <div
        className={`flex items-start gap-4 text-gray-900 font-semibold w-full mb-2`}
      >
        <div className="bg-gray-200 py-2 px-4 rounded-full text-gray-400">
          1
        </div>
        <FlexBox direction="col" className="w-full items-start">
          <div className="flex flex-col items-start gap-4 w-full">
            <label>
              <span className="text-blue-500">장진영</span>님의 점수를{" "}
              <span className="text-blue-500">10점 만점</span>으로 입력해주세요
            </label>
            <div className="border border-gray-300 bg-blue-50 rounded-lg p-4 w-full">
              <div className="flex flex-col items-start gap-4">
                <p className="font-medium">
                  최종 평점:{" "}
                  <span className="font-bold text-blue-700">6.5점 </span>
                  <span className="text-gray-500">(5명)</span>
                </p>
                <div className="w-full border-t border-gray-300"></div>
                <div className="grid grid-cols-2 font-medium gap-4 w-full font-normal justify-between">
                  <p>장진영: 8.2점</p>
                  <p>전주현: 8.2점</p>
                  <p>심새벽: 8.2점</p>
                  <p>이수찬: 8.2점</p>
                  <p>오승민: 8.2점</p>
                </div>
              </div>
            </div>
          </div>
        </FlexBox>
      </div>

      <div
        className={`flex items-start gap-4 text-gray-900 font-semibold w-full mb-2`}
      >
        <div className="bg-gray-200 py-2 px-4 rounded-full text-gray-400">
          2
        </div>
        <FlexBox direction="col" className="w-full items-start">
          <div className="flex flex-col items-start gap-4 w-full">
            <label>
              <span className="text-blue-500">점수를 뒷받침하는 의견을</span>{" "}
              간략하게 작성해주세요
            </label>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-4 bg-white">
              <p className="text-gray-500">장진영</p>
              <p className="font-normal text-balance">
                흩날리는 벚꽃잎, 따스한 햇살 아래 수채화처럼 번져간다. 봄바람은
                나뭇가지를 간지럽히고, 새들은 지저귄다. 어린 시절 골목길이
                떠오르는 오후.
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-4 bg-white">
              <p className="text-gray-500">오민석</p>
              <p className="font-normal text-balance">
                흩날리는 벚꽃잎, 따스한 햇살 아래 수채화처럼 번져간다. 봄바람은
                나뭇가지를 간지럽히고, 새들은 지저귄다. 어린 시절 골목길이
                떠오르는 오후.
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-4 bg-white">
              <p className="text-gray-500">심새벽</p>
              <p className="font-normal text-balance">
                흩날리는 벚꽃잎, 따스한 햇살 아래 수채화처럼 번져간다. 봄바람은
                나뭇가지를 간지럽히고, 새들은 지저귄다. 어린 시절 골목길이
                떠오르는 오후.
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-4 bg-white">
              <p className="text-gray-500">이수찬</p>
              <p className="font-normal text-balance">
                흩날리는 벚꽃잎, 따스한 햇살 아래 수채화처럼 번져간다. 봄바람은
                나뭇가지를 간지럽히고, 새들은 지저귄다. 어린 시절 골목길이
                떠오르는 오후.
              </p>
            </div>
            <div className="border border-gray-300 rounded-lg p-4 flex flex-col gap-4 bg-white">
              <p className="text-gray-500">오승민</p>
              <p className="font-normal text-balance">
                흩날리는 벚꽃잎, 따스한 햇살 아래 수채화처럼 번져간다. 봄바람은
                나뭇가지를 간지럽히고, 새들은 지저귄다. 어린 시절 골목길이
                떠오르는 오후.
              </p>
            </div>
          </div>
        </FlexBox>
      </div>
    </>
  );
};

export default AnalysisTab;
