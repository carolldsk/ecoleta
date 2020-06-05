import React, {useEffect, useState, ChangeEvent} from 'react';
import { Link } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import {LeafletMouseEvent} from 'leaflet';

import './styles.css';
import logo from '../../assets/logo.svg';


// Sempre que criamos um estado para um Array ou objeto, precisamos manualmente informar o tipo da variável 
interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IbgeUf {
    sigla: string;
}

interface IbgeCity {
    nome: string;
}

const CreatePoint = () => {

    /*
    * ***  SETANDO ESTADOS DOS COMPONENTES  ***
    * Utilizando desestruturação pegando o retorno do useState e criando duas variáveis items e setItems
    * retorna um array assim : [0 => valor do estado , 1 => funcao para atualizar o valor do estado]
    **/
    const [ufs, setUfs]       = useState<string[]>([]); //useState<string[]>  significa que o estado é um array de string ou seja dessa vez estamos apenas tipando e nao chamando a interface, ([]) é o retorno do setUfs, informado que o inicio do estado é um array vazio
    const [items, setItems]   = useState<Item[]>([]); // useState<Item[]> significa que o estado é um array de Item, ([]) é o retorno do set item, informado que o inicio do estado é um array vazio
    const [cities, setCities] = useState<string[]>([]); //useState<string[]>  significa que a cidade é um array de string ou seja dessa vez estamos apenas tipando e nao chamando a interface, ([]) é o retorno do setCities, informado que o inicio do estado é um array vazio
    const [initialPosition, setInitialPosition] = useState<[number, number]>([-23.5569532,-46.6611564]); // useState<[number, number]>  significa que a initialPosition é um array com duas posições contendo dois inteiros, sendo assim, também tipando mas de outra forma, ([]) é o retorno do setInitialPosition, informado que o inicio do estado é um array com valores zerados

    // Guarda comportamento da option selecionada pelo user
    const [selectedUF, setSelectedUF]     = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);


    /*
    * ***  SETANDO OS EFFECT HOOK   ***
    * // (Hook de Efeito, Similar ao componentDidMount e componentDidUpdate) 
    * Utilizando para renderizar os valores atualizados nos estados
    * 
    * É formado da seguinte forma: Primeiro parâmetro é qual função eu quero executar, segundo parâmetro é quando eu quero executar
    **/

    useEffect(() =>{

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setInitialPosition([latitude, longitude]);
        })

    }, []);

    useEffect(() => {
        api.get('items').then(response  => {
            setItems(response.data);
        });

    }, []);

    useEffect(() => {

        // Para tipar o retorno do get, falando que o retorno é um array : <IbgeUf[]>
        axios.get<IbgeUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then(response  => {
            
            // A internace IbgeUf foi criada para tipar : uf.sigla
            let ufInicials = response.data.map(uf => uf.sigla);

            setUfs(ufInicials);
        });

    }, []);

    // Carrega as cidades sempre que a UF mudar
    useEffect(() => {
        
        // Para nao consumir api desnecessáriamente
        if(selectedUF !== '0'){
            
            // Para tipar o retorno do get, falando que o retorno é um array : <IbgeCity[]>
            axios.get<IbgeCity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response  => {
                
                // A internace IbgeCity foi criada para tipar : city.name
                let citiesNames = response.data.map(city => city.nome);          
    
                setCities(citiesNames);
            });
        } 

    }, [selectedUF]); // Parâmetro que verifica quantas vezes essa função vai executar (Sempre o estado da selectedUF for alterada)


    /**
     *  *** Funções de mudança de comportamento (Eventos para Onchange, Onclick) ***
     * No TypeScript, precisamos falar que o tipo recebido é um evento de HTML, conforme : (event: ChangeEvent<HTMLSelectElement>)
     */

    function handleSelectedUF(event: ChangeEvent<HTMLSelectElement>){

        // Aplicando os conceitos de imutabilidade e alterando o estado do selectedUF a cada change
        let uf = event.target.value;
        setSelectedUF(uf);
    }
    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
        
        // Aplicando os conceitos de imutabilidade e alterando o estado do selectedCity a cada change
        let city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){

        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }


    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name"/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" name="email" id="email"/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp"/>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition}>
                            <Popup>
                                Ponto de coleta <br /> 
                                Localizado neste lugar.
                            </Popup>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUF} onChange={handleSelectedUF}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectedCity}>
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li key={item.id}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>

                        ))}

                    </ul>
                </fieldset>
                <button type="submit"> Cadastrar ponto de coleta</button>
            </form>
        </div>
    );
}

export default CreatePoint;