import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    error: '',
  };

  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({
        repositories: JSON.parse(repositories),
      });
    }
  }

  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      this.setState({ loading: true });

      const { newRepo, repositories } = this.state;

      // Check dublicated repository
      const hasDuplicated = repositories.filter(
        r => r.name === newRepo.toLowerCase()
      ).length;

      if (hasDuplicated) throw new Error('Repositório duplicado!');

      const response = await api.get(`/repos/${newRepo}`);

      const data = {
        name: response.data.full_name.toLowerCase(),
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });
    } catch (err) {
      const error =
        err.response && err.response.status === 404
          ? 'Repositório não encontrado!'
          : err.message;

      this.setState({ error, loading: false });
    }
  };

  render() {
    const { newRepo, loading, repositories, error } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit} invalid={!!error}>
          <div>
            <input
              type="text"
              placeholder="Adicionar repositório"
              value={newRepo}
              onChange={this.handleInputChange}
            />

            {error && <small>{error}</small>}
          </div>
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(({ name }) => (
            <li key={name}>
              <span>{name}</span>
              <Link to={`/repository/${encodeURIComponent(name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
