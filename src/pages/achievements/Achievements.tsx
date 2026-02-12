import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";
import { useFetchList } from "../../hooks";
import type { IUserAchievement } from "../../interfaces";
import { userAchievementService } from "../../services/userAchievementService";

export default function AchievementList() {
  const { response, loading, errorMessage, isEmpty } =
    useFetchList<IUserAchievement>({
      fetchFn: userAchievementService.getAllAchievements,
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
        <div className="flex gap-7 justify-center">
          {achievements.map((achievement) => (
            <article
              key={achievement._id}
              className={`${achievement.userProgress.status !== "completed" ? "saturate-0" : ""} flex flex-col gap-3 items-center shadow-brand-achievement pt-5 pb-8 px-2 bg-white w-full max-w-[200px] rounded-xl`}
            >
              <div className="flex flex-col gap-1 items-center">
                <img
                  className="w-[80px] h-[80px] rounded-full"
                  src={achievement.imageUrl}
                  alt={achievement.title}
                />
                <h3 className="text-base">{achievement.title}</h3>
              </div>

              <p className="text-center font-bold text-xs">
                {achievement.description}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <StateMessage itemName="los logros" variant="notFoundList" />
      )}
    </div>
  );
}
