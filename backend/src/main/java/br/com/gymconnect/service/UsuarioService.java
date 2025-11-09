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

    public ResponseEntity<ResponseModel> remover(Long idUsuario){
        
        ur.deleteById(idUsuario);

        rm.setMensagem("O Usuario foi removido com sucesso!");
        return new ResponseEntity<ResponseModel>(rm, HttpStatus.OK);
    }

}
