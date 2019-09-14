import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

import api from '../../services/api';
import {
  Loading,
  Owner,
  IssueList,
  Filter,
  FilterItem,
  Paginate,
  BtnPaginate,
  BtbExcluir,
} from './styles';
import Container from '../../components/Container';

class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
    selectedIssueState: 'closed',
    issueStates: ['all', 'open', 'closed'],
    page: 1,
    repoName: '',
  };

  async componentDidMount() {
    await this.loadRepository({ state: 'closed', page: 1 });
  }

  handleFilterChange = async state => {
    await this.loadRepository({ state, page: 1 });
  };

  handlePrevPage = async () => {
    const { page, state } = this.state;

    if (page === 1) return;

    await this.loadRepository({
      page: page - 1,
      state,
    });
  };

  handleNextPage = async () => {
    const { page, repository, state } = this.state;

    if (repository.length === 0) return;

    await this.loadRepository({
      page: page + 1,
      state,
    });
  };

  deleteRepository = () => {
    const { history } = this.props;
    const { repoName } = this.state;

    const repositories = JSON.parse(localStorage.getItem('repositories'));
    console.log(repositories);
    const repositoryFiltered = repositories.filter(r => r.name !== repoName);

    localStorage.setItem('repositories', JSON.stringify(repositoryFiltered));

    return history.push('/');
  };

  async loadRepository({ state, page }) {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state,
          per_page: 5,
          page,
        },
      }),
    ]);

    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data,
      selectedIssueState: state,
      state,
      page,
      repoName,
    });
  }

  render() {
    const {
      repository,
      issues,
      loading,
      issueStates,
      selectedIssueState,
      page,
    } = this.state;

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <Filter>
          <strong>Filtros</strong>
          {issueStates.map(state => (
            <FilterItem
              key={state}
              active={selectedIssueState === state}
              onClick={() => this.handleFilterChange(state)}
            >
              {state}
            </FilterItem>
          ))}
        </Filter>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>

        <Paginate>
          <BtnPaginate onClick={this.handlePrevPage} isDisabled={page === 1}>
            <FaAngleLeft width={14} /> <span>Anterior</span>
          </BtnPaginate>

          <BtnPaginate
            onClick={this.handleNextPage}
            isDisabled={issues.length === 0}
          >
            <span>Próximo</span> <FaAngleRight width={14} />
          </BtnPaginate>
        </Paginate>

        <BtbExcluir onClick={this.deleteRepository}>Excluir</BtbExcluir>
      </Container>
    );
  }
}

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Repository;
