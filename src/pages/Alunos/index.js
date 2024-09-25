import React, {useState, useEffect} from "react";
import { Link } from 'react-router-dom'
import './styles.css';
import logoCadastro from '../../assets/register.png'
import { FiEdit, FiUserX, FiXCircle } from "react-icons/fi";
import api from '../../services/api'
import { useNavigate } from "react-router-dom";

export default function Alunos(){

    const [searchInput, setSearchInput] = useState('');
    const [filtro, setFiltro] = useState('');

    const [alunos, setAlunos] = useState([]);

    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const authorization = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const searchAlunos = (searchValue) => {
        setSearchInput(searchValue);
        if(searchInput !== ''){
            const dadosFiltrados = alunos.filter((item) => {
                return Object.values(item).join('').toLocaleLowerCase()
                    .includes(searchInput.toLocaleLowerCase())
            });
            setFiltro(dadosFiltrados);
        }else{
            setFiltro(alunos);
        }
    }

    useEffect(() => {
        api.get('api/Alunos', authorization).then(
            response => {setAlunos(response.data);

            }, token)
    })

    async function logout(){
        try{
            localStorage.clear();
            localStorage.setItem('token', '');
            authorization.headers = '';
            navigate('/');
        }catch(error){
            alert('Não foi possível fazer o logout. \n\n' + error)
        }
    }

    async function editAluno(id){
        try{
            navigate(`novo/${id}`)
        }catch(error){
            alert('Não foi possível editar o aluno. \n\n' + error)
        }
    }

    async function deleteAluno(id) {
        try{
            if(window.confirm('Deseja deletar o aluno de id = ' + id + '?')){
                await api.delete(`api/alunos/${id}`, authorization);
                setAlunos(alunos.filter(aluno => aluno.id !== id));
            }
        }catch(error){
            alert('Não foi possível excluir o aluno. \n\n' + error);
        }
    }

    return(
        <div className="aluno-container">
            <header>
            <img src={logoCadastro} alt="Cadastro"/>
            <span>Bem-vindo(a), <strong>{email}</strong>.</span>
            <Link className="button" to="/alunos/novo/0">Novo Aluno</Link>
            <button type="button" onClick={logout}>
                <FiXCircle size={35} color="#17202a"/>
            </button>
            </header>
            <form>
                <input type="text" placeholder="Filtrar por nome..."
                onChange={(e) => searchAlunos(e.target.value)}/>
            </form>
            <h1>Lista de Alunos</h1>

            {searchInput.length > 1 ? (
            <ul>
                {filtro.map(aluno => (
                    <li key={aluno.id}>
                        <b>Nome: </b>{aluno.nome}<br/><br/>
                        <b>Email: </b>{aluno.email}<br/><br/>
                        <b>Idade: </b>{aluno.idade}<br/><br/>

                        <button onClick={() => editAluno(aluno.id)} type="button">
                            <FiEdit size="30" color="#17202a"/>
                        </button>
                        <button type="button" onClick={() => deleteAluno(aluno.id)}>
                            <FiUserX size="30" color="#17202a"/>
                        </button>
                    </li>
                ))}
            </ul>
            ) : (
            <ul>
                {alunos.map(aluno => (
                    <li key={aluno.id}>
                        <b>Nome: </b>{aluno.nome}<br/><br/>
                        <b>Email: </b>{aluno.email}<br/><br/>
                        <b>Idade: </b>{aluno.idade}<br/><br/>

                        <button onClick={() => editAluno(aluno.id)} type="button">
                            <FiEdit size="30" color="#17202a"/>
                        </button>
                        <button type="button" onClick={() => deleteAluno(aluno.id)}>
                            <FiUserX size="30" color="#17202a"/>
                        </button>
                    </li>
                ))}
            </ul>

            )};
        </div>        
    )
}