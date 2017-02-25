package li.barlog.app.rest

import li.barlog.app.config.AppConfig
import org.junit.Test
import org.junit.Assert.assertEquals
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit4.SpringRunner

@RunWith(SpringRunner::class)
@SpringBootTest(
	classes = arrayOf(AppConfig::class),
	webEnvironment = WebEnvironment.RANDOM_PORT
)
@ActiveProfiles("test")
class FooControllerIT {
	@Autowired
	lateinit var restTemplate: TestRestTemplate

	@Test
	fun get() {
		val request = HttpEntity<Void>(headers())

		val response = restTemplate.exchange("/api/foo", HttpMethod.GET,
			request, List::class.java)
		assertEquals(HttpStatus.OK, response.statusCode)
		assertEquals(50, response.body.size)
	}

	private fun headers() = run {
		val headers = HttpHeaders()
		headers.contentType = MediaType.APPLICATION_JSON_UTF8
		headers.accept = listOf(MediaType.APPLICATION_JSON_UTF8)
		headers
	}
}
