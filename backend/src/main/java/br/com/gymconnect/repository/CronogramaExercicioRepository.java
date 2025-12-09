package br.com.gymconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.com.gymconnect.model.CronogramaExercicio;

@Repository
public interface CronogramaExercicioRepository extends JpaRepository<CronogramaExercicio, Long> {

    @Query("SELECT ce FROM CronogramaExercicio ce JOIN FETCH ce.cronograma c WHERE c.aluno.idUsuario = :idAluno")
    List<CronogramaExercicio> findByCronograma_Aluno_IdUsuario(@Param("idAluno") Long idAluno);
}