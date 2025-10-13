package br.com.gymconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.gymconnect.model.CronogramaExercicio;

@Repository
public interface CronogramaExercicioRepository extends JpaRepository<CronogramaExercicio, Long>{
    
}
