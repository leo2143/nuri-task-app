import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Select, Button } from "../../components/ui";
import type { IGoalCatalog, IAddSubGoal } from "../../interfaces";
import { useHttpError } from "../../hooks";
import { goalService } from "../../services/goalService";
import { arrowsUpDown } from "../../assets/svg-icons";

export default function GoalSubGoalForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { errorMessage, handleError, clearError } = useHttpError();
  const [loading, setLoading] = useState(false);
  const [goalCatalogs, setGoalCatalogs] = useState<IGoalCatalog[]>([]);

  const pageTitle = "Asociar Metas";

  // const [title, setTitle] = useState("");
  const [goalId, setgoalId] = useState("");
  const [parentGoalTitle, setParentGoalTitle] = useState("");

  useEffect(() => {
    const fetchGoalCatalog = async () => {
      try {
        setLoading(true);
        clearError();
        const data = await goalService.getCatalogGoals();

        // Obtenengo el tiulo antes de renderizar el select
        if (id) {
          const parentGoal = data.find((goal) => goal.id === id);
          if (parentGoal) {
            setParentGoalTitle(parentGoal.title);
          }
        }
        const filteredData = id ? data.filter((goal) => goal.id !== id) : data;

        setGoalCatalogs(filteredData);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoalCatalog();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      //TODO: ACA DEBERIA VERIFICAR ANTES DE ENVIAR SI EXISTE UNA META RELACIONADA CON LA META RELACIONADA
      //SI ESTA RELACIONADA DEBERIAMOS ALERTAR AL USUARIO DE QUE LA VA A ELIMINAR DE LA OTRA META
      setLoading(true);

      // Crear el body con el id de la submeta
      const body: IAddSubGoal = {
        subgoalId: goalId!,
      };

      await goalService.addSubgoal(id!, body);

      console.log("Meta asociada exitosamente");

      setTimeout(() => {
        navigate(`/goals/${id}`);
      }, 1500);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-tertiary mb-2">
          {pageTitle}
        </h2>

        <div>
          <p className="mt-4">Meta</p>
          <div className="mt-2 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="font-body text-sm text-tertiary">{parentGoalTitle}</p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-body text-red-600">{errorMessage}</p>
        </div>
      )}
      <div className="flex justify-center py-5">
        <img src={arrowsUpDown} alt="flechas arriba abajo" />
      </div>
      <form onSubmit={handleSubmit} noValidate method="post">
        <div>
          <Select
            id="goalId"
            name="goalId"
            label="Elegí la meta que querés asociar"
            value={goalId}
            onChange={(e) => setgoalId(e.target.value)}
            options={goalCatalogs}
            placeholder="Sin meta asociada"
            disabled={loading}
          />
        </div>

        <Button
          className="mt-8"
          fullWidth
          variant="primary"
          type="submit"
          ariaLabel="Asociar"
        >
          Asociar
        </Button>
      </form>
    </section>
  );
}
