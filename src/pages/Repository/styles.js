import styled, { css } from 'styled-components';

export const Loading = styled.div`
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Owner = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  a {
    color: #7159c1;
    font-size: 16px;
    text-decoration: none;
  }

  img {
    width: 120px;
    border-radius: 50%;
    margin-top: 20px;
  }

  h1 {
    font-size: 24px;
    margin-top: 10px;
  }

  p {
    margin-top: 5px;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    text-align: center;
    max-width: 400px;
  }
`;

export const IssueList = styled.ul`
  list-style: none;

  li {
    display: flex;
    padding: 15px 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    transition: border 500ms;

    &:hover {
      border-left: 1px solid #7159c1;
    }

    & + li {
      margin-top: 10px;
    }

    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #eee;
    }

    div {
      flex: 1;
      margin-left: 15px;

      strong {
        font-size: 16px;

        a {
          text-decoration: none;
          color: #333;

          &:hover {
            color: #7159c1;
          }
        }

        span {
          background: #eee;
          color: #333;
          border-radius: 2px;
          font-weight: 600;
          height: 20px;
          padding: 3px 4px;
          margin-left: 10px;
        }
      }

      p {
        margin-top: 5px;
        font-size: 12px;
        color: #999;
      }
    }
  }
`;

export const Filter = styled.section`
  /* Cria linha separadora com bordas simetricas */
  padding-top: 30px;
  margin: 30px 0;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;

  strong {
    margin-right: 10px;
  }
`;

export const FilterItem = styled.button`
  padding: 5px 10px;
  border-radius: 4px;
  margin-right: 5px;
  border: none;

  &:hover {
    padding: 4px 9px;
    border: 1px solid #7159c1;
  }

  ${props =>
    props.active &&
    css`
      background: #7159c1;
      font-weight: 600;
      color: #fff;
    `}
`;

export const Paginate = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
`;

export const BtnPaginate = styled.button.attrs(props => ({
  type: 'button',
  disabled: props.isDisabled,
}))`
  padding: 5px 10px;
  border-radius: 4px;
  margin: 0 5px;
  border: none;

  display: flex;
  justify-content: space-around;
  align-items: center;

  &[disabled] {
    color: #999;
    cursor: not-allowed;
    border: none;
  }

  ${props =>
    !props.isDisabled &&
    css`
      &:hover {
        padding: 4px 9px;
        border: 1px solid #7159c1;
      }
    `}
`;
