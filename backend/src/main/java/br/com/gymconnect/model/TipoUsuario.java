package br.com.gymconnect.model;

public enum TipoUsuario {

    CLIENTE("CLIENTE"),
    ALUNO("ALUNO");

    private String tipo;

    TipoUsuario(String tipo){
        this.tipo = tipo;
    }

    public String getTipo(){
        return tipo;
    }
}
