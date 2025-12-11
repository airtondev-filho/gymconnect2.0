package br.com.gymconnect.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import br.com.gymconnect.model.Cronograma;
import br.com.gymconnect.model.CronogramaExercicio;
import br.com.gymconnect.model.Exercicio;
import br.com.gymconnect.model.ResponseModel;
import br.com.gymconnect.repository.CronogramaExercicioRepository;
import br.com.gymconnect.repository.CronogramaRepository;
import br.com.gymconnect.repository.ExercicioRepository;

@Service
public class CronogramaExercicioService {

    @Autowired
    private CronogramaExercicioRepository csr;

    @Autowired
    private CronogramaRepository cr;

    @Autowired
    private ExercicioRepository exr;

    public ResponseEntity<?> cadastrar(CronogramaExercicio cronogExerc) {

        ResponseModel rm = new ResponseModel();

        Long cronograma = cronogExerc.getCronograma().getIdCronograma();

        Long exercicio = cronogExerc.getExercicio().getIdExercicio();

        Optional<Cronograma> cronogramaOpt = cr.findById(cronograma);

        if (cronogramaOpt.isEmpty()) {

            rm.setMensagem("Campo cronograma precisa ser preenchido!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.BAD_REQUEST);

        }

        Optional<Exercicio> exercicioOpt = exr.findById(exercicio);

        if (exercicioOpt.isEmpty()) {

            rm.setMensagem("Exercicio não preenchido!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.BAD_REQUEST);

        }

        cronogExerc.setCronograma(cronogramaOpt.get());

        cronogExerc.setExercicio(exercicioOpt.get());

        CronogramaExercicio salvo = csr.save(cronogExerc);

        rm.setMensagem("Cadastrado com sucesso!");
        return new ResponseEntity<>(salvo, HttpStatus.OK);
    }

    public ResponseEntity<?> remover(Long idExercicoCronograma) {

        ResponseModel rm = new ResponseModel();

        Optional<CronogramaExercicio> cronogExercOpt = csr.findById(idExercicoCronograma);

        if (cronogExercOpt.isEmpty()) {

            rm.setMensagem("Cronograma de exercicios não encontrado!");
            return new ResponseEntity<>(rm, HttpStatus.BAD_REQUEST);

        }

        csr.delete(cronogExercOpt.get());
        rm.setMensagem("Cronograma deletado");
        return new ResponseEntity<>(rm, HttpStatus.OK);

    }

    public ResponseEntity<?> listar(Long idAluno) {

        List<CronogramaExercicio> exercicios = csr.findByCronograma_Aluno_IdUsuario(idAluno);

        // Criar lista de respostas com cronograma incluído manualmente
        java.util.List<java.util.Map<String, Object>> response = new java.util.ArrayList<>();

        for (CronogramaExercicio ce : exercicios) {
            java.util.Map<String, Object> item = new java.util.LinkedHashMap<>();
            item.put("idCronogramaExercicio", ce.getIdCronogramaExercicio());

            // Adicionar cronograma manualmente
            java.util.Map<String, Object> cronogramaData = new java.util.LinkedHashMap<>();
            cronogramaData.put("idCronograma", ce.getCronograma().getIdCronograma());
            cronogramaData.put("nome", ce.getCronograma().getNome());
            item.put("cronograma", cronogramaData);

            // Adicionar exercício
            java.util.Map<String, Object> exercicioData = new java.util.LinkedHashMap<>();
            exercicioData.put("idExercicio", ce.getExercicio().getIdExercicio());
            exercicioData.put("nome", ce.getExercicio().getNome());
            exercicioData.put("linkYoutube", ce.getExercicio().getLinkYoutube());
            item.put("exercicio", exercicioData);

            item.put("diaSemana", ce.getDiaSemana());
            item.put("serie", ce.getSerie());
            item.put("repeticao", ce.getRepeticao());
            item.put("carga", ce.getCarga());

            response.add(item);
        }

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> listarPorCronograma(Long idCronograma) {
    List<CronogramaExercicio> exercicios = csr.findByCronogramaIdCronograma(idCronograma);
    return ResponseEntity.ok(exercicios);
}

}
