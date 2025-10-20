package br.com.gymconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.gymconnect.model.Exercicio;


@Repository
public interface ExercicioRepository extends JpaRepository<Exercicio, Long>{
    
    List<Exercicio> findByIdExercicio(Long idExercicio);
}
