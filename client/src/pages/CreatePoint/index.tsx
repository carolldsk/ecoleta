import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {FiArrowLeft} from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';

import './styles.css';
import logo from '../../assets/logo.svg';


const CreatePoint = () => {

    // Utilizando desestruturação pegando o retorno do useState e criando duas variáveis items e setItems
    const [items, setItems] = useState([]);// retorna um array assim : [0 => valor do estado , 1 => funcao para atualizar o valor do estado]


    // Primeiro parâmetro é qual função eu quero executar, segundo parâmetro é quando eu quero executar
    useEffect(() => {
        api.get('items').then(response  => {
            
            setItems(response.data);

        });

    }, []);

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

                    <Map center={[-23.5569532, -46.6611564]} zoom={15}>
                        <TileLayer 
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[-23.5569532, -46.6611564]}>
                            <Popup>
                                Ponto de coleta <br /> 
                                Localizado neste lugar.
                            </Popup>
                        </Marker>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf">
                                <option value="0">Selecione uma UF</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
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
                            <li>
                                <img src="http://localhost:3333/uploads/oleo.svg" alt="Oleo de cozinha"/>
                                <span>Óleo de Cozinha</span>
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