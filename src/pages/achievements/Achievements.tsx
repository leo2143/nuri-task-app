import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";
import { AchievementCard } from "../../components/ui";
import { useFetchDataOffline, useFetchListOffline } from "../../hooks";
import type { IUserAchievement, IUserAchievementStats } from "../../interfaces";
import { userAchievementService } from "../../services/userAchievementService";

const TIER_ORDER: Record<string, number> = { basic: 0, premium: 1 };

export default function AchievementList() {
  const { response, loading, errorMessage, isEmpty } =
    useFetchListOffline<IUserAchievement>({
      fetchFn: userAchievementService.getAllAchievements,
      cacheKey: "achievements",
    });

  const { data: stats } = useFetchDataOffline<IUserAchievementStats>({
    fetchFn: userAchievementService.fetchAchievementStats,
    cacheKey: "achievements-stats",
  });
  const premiumLocked = stats?.premiumLocked ?? 0;

  const sortedAchievements = [...(response?.data || [])].sort(
    (currentAchievement, nextAchievement) => {
      const tierDiff =
        (TIER_ORDER[currentAchievement.tier] ?? 1) -
        (TIER_ORDER[nextAchievement.tier] ?? 1);

      if (tierDiff !== 0) return tierDiff;

      return currentAchievement.title.localeCompare(nextAchievement.title, "es");
    },
  );

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
        <>
          <div className="grid grid-cols-2 gap-4">
            {sortedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement._id}
                achievement={achievement}
              />
            ))}
          </div>
          {premiumLocked > 0 && (
            <p className="text-center font-bold text-sm">
              {premiumLocked === 1
                ? "Con Premium hay 1 logro más para descubrir."
                : `Con Premium hay ${premiumLocked} logros más para descubrir.`}
            </p>
          )}
        </>
      ) : (
        <StateMessage itemName="los logros" variant="notFoundList" />
      )}
    </div>
  );
}
