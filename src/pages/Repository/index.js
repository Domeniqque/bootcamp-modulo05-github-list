import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import { Loading, Owner, IssueList, Filter, FilterItem } from './styles';
import Container from '../../components/Container';

class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
    selectedIssueState: 'closed',
    issueStates: ['all', 'open', 'closed'],
  };

  async componentDidMount() {
    await this.loadRepository();
  }

  handleFilterChange = async state => {
    await this.loadRepository(state);
  };

  async loadRepository(state = 'closed') {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      loading: false,
      repository: repository.data,
      issues: issues.data,
      selectedIssueState: state,
    });
  }

  render() {
    const {
      repository,
      issues,
      loading,
      issueStates,
      selectedIssueState,
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
};

export default Repository;
