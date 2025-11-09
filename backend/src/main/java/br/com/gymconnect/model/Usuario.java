package  br.com.gymconnect.model;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private long idUsuario;

    @Column(name = "uuid_usuario", nullable = false, unique = true, columnDefinition = "CHAR(16)" )
    private String uuidUsuario;

    @Column(nullable=false, length=150)
    private String nome;

    @Column(nullable=false, length=150, unique=true)
    private String email;

    @Column(nullable=false, length=100)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private TipoUsuario tipo;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Usuario cliente;

    @PrePersist
    public void gerarUUID() {

        if (uuidUsuario == null || uuidUsuario.isEmpty()) {
            
            this.uuidUsuario = UUID.randomUUID().toString().replace("-","").substring(0,16);
        
        }
    }

    public Usuario(String nome, String email, String senha, TipoUsuario tipo){
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }

    public Usuario(){

    }

    public long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getUuidUsuario() {
        return uuidUsuario;
    }

    public void setUuidUsuario(String uuidUsuario) {
        this.uuidUsuario = uuidUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public TipoUsuario getTipo() {
        return tipo;
    }

    public void setTipo(TipoUsuario tipo) {
        this.tipo = tipo;
    }

    public Usuario getCliente() {
        return cliente;
    }

    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.tipo == TipoUsuario.CLIENTE) {
            return List.of(new SimpleGrantedAuthority("CLIENTE"));
        } else if (this.tipo == TipoUsuario.ALUNO) {
            return List.of(new SimpleGrantedAuthority("ALUNO"));
        }
        return List.of();
    }

    @Override
    public String getPassword() {
        return senha;
    }

    @Override
    public String getUsername() {
        return email;
    }


}
