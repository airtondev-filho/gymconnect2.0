package br.com.gymconnect.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "cronograma_exercicio")
public class CronogramaExercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cronograma_exercicio")
    private Long idCronogramaExercicio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cronograma", nullable = false)
    private Cronograma cronograma;

    @ManyToOne
    @JoinColumn(name = "id_exercicio", nullable = false)
    private Exercicio exercicio;

    @Enumerated(EnumType.STRING)
    @Column(name = "dia_semana")
    private DiaSemana diaSemana;

    @Column
    private Integer serie;

    @Column
    private Integer repeticao;

    @Column
    private Integer carga;

    // Getter manual para forçar serialização
    @JsonProperty("cronograma")
    public Cronograma getCronograma() {
        return this.cronograma;
    }

}