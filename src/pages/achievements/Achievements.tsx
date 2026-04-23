import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";
import { AchievementCard } from "../../components/ui";
import { useFetchListOffline } from "../../hooks";
import type { IUserAchievement } from "../../interfaces";
import { userAchievementService } from "../../services/userAchievementService";

export default function AchievementList() {
  const { response, loading, errorMessage, isEmpty } =
    useFetchListOffline<IUserAchievement>({
      fetchFn: userAchievementService.getAllAchievements,
      cacheKey: "achievements",
    });

  const achievements = response?.data || [];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="font-heading">Logros</h2>
      </header>

      {errorMessage ? (
        <StateMessage itemName="los logros" variant="error" />
      ) : !isEmpty ? (
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement._id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <StateMessage itemName="los logros" variant="notFoundList" />
      )}
    </div>
  );
}
