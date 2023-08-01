import RankingProfile from '../../components/rankingpage/rankingProfile.js'
import RankMyProfile from '../../components/rankingpage/rankMyProfile.js'
import RankingSearchBar from '../../components/rankingpage/rankingSearchBar.js'

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from 'react-bootstrap';

function Ranking() {
    return (
        <div className="wrapper mx-auto">
            <Container>
                <Row> 
                    <Col>
                        <RankMyProfile />
                    </Col>
                    <Col>
                        <RankingSearchBar />
                        <Container>
                            <Row>
                                <Col>
                                    랭킹
                                </Col>
                                <Col>
                                </Col>
                                <Col>
                                    유저명
                                </Col>
                                <Col>
                                    경험치
                                </Col>
                                <Col>
                                    승률
                                </Col>
                            </Row>
                        </Container>
                        <div className="mx-auto">
                            <RankingProfile />
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default Ranking;