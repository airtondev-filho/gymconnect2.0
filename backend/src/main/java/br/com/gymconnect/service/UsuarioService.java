package br.com.gymconnect.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import br.com.gymconnect.model.ResponseModel;
import br.com.gymconnect.model.Usuario;
import br.com.gymconnect.repository.UsuarioRepository;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository ur;

    @Autowired
    private ResponseModel rm;

    public Iterable<Usuario> listar(){
        return ur.findAll();
    }

    public ResponseEntity<?> cadastrar(Usuario user){
        
        if (user.getNome().equals("")) {
            rm.setMensagem("O campo Nome é obrigatório!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.BAD_REQUEST);
        } else if(user.getEmail().equals("")){
            rm.setMensagem("O campo E-mail é obrigatório!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.BAD_REQUEST);
        } else if(user.getSenha().equals("")){
            rm.setMensagem("O campo Senha é obrigatório!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.BAD_REQUEST);
        } else if(user.getTipo().equals("")){
            rm.setMensagem("O campo Tipo é obrigatório!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.BAD_REQUEST);
        } else {
            return new ResponseEntity<Usuario>(ur.save(user), HttpStatus.CREATED);
        }
    }

    public ResponseEntity<ResponseModel> remover(Long idUsuario){
        
        ur.deleteById(idUsuario);

        rm.setMensagem("O Usuario foi removido com sucesso!");
        return new ResponseEntity<ResponseModel>(rm, HttpStatus.OK);
    }

    public ResponseEntity<ResponseModel> login(String email, String senha){

        ResponseModel rm = new ResponseModel();

        Optional<Usuario> usuarioOpt = ur.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            rm.setMensagem("Email não encontrado!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.NOT_FOUND);
        }

        Usuario usuario = usuarioOpt.get();

        if (!usuario.getSenha().equals(senha)) {
            rm.setMensagem("Senha incorreta!");
            return new ResponseEntity<ResponseModel>(rm, HttpStatus.UNAUTHORIZED);
        }

        rm.setMensagem("Login realizado com sucesso!");
        return new ResponseEntity<ResponseModel>(rm, HttpStatus.OK);
    }

}
