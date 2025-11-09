package br.com.gymconnect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.gymconnect.model.AutorizationDTO;
import br.com.gymconnect.model.CadastrarDTO;
import br.com.gymconnect.model.Usuario;
import br.com.gymconnect.repository.UsuarioRepository;


@RestController
@RequestMapping("auth") 
@CrossOrigin(origins = "http://localhost:3000")
public class AuthenticatedController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UsuarioRepository ur;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Validated AutorizationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/cadastrar")
    public ResponseEntity cadastrar(@RequestBody @Validated CadastrarDTO data){

        if (this.ur.findByEmail(data.email()) != null) {
            return ResponseEntity.badRequest().build(); 
        } 

        String encryptedSenha = new BCryptPasswordEncoder().encode(data.senha());
        Usuario newUsuario = new Usuario(data.nome(), data.email(), encryptedSenha, data.tipo());

        this.ur.save(newUsuario);

        return ResponseEntity.ok().build();
    }
    

    
}
