package br.com.gymconnect.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "cronograma")
public class Cronograma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cronograma")
    private Long idCronograma;

    @Column(name = "nome", length = 150)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "id_aluno", nullable = false)
    @JsonIgnoreProperties({ "senha", "authorities", "credentialsNonExpired", "accountNonExpired", "accountNonLocked",
            "enabled" })
    private Usuario aluno;

    @Column(name = "dias_totais", nullable = true)
    private Integer diasTotais;

    @OneToMany(mappedBy = "cronograma", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CronogramaExercicio> exercicio;
}